(function(Vue, http){
	const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
	Vue.component('upload',{
		name: 'Upload',
		template: '#template-upload',
		data() {
			return {
				uploadError: null,
				currentStatus: null,
				uploadFieldName: 'csv',
				fileCount: 0,
				fileList:[]
			}
		},
		computed: {
			isInitial() { return this.currentStatus === STATUS_INITIAL; },
			isSaving()  { return this.currentStatus === STATUS_SAVING;  },
			isSuccess() { return this.currentStatus === STATUS_SUCCESS; },
			isFailed()  { return this.currentStatus === STATUS_FAILED;  }
		},
		methods: {
			reset() {
				// reset form to initial state
				this.currentStatus = STATUS_INITIAL;
				this.uploadError = null;
				this.fileList = [];
			},
			save(formData) {
				// upload data to the server
				this.currentStatus = STATUS_SAVING;
				
				http.post('http://localhost:3000/users', formData)
					.then(x => {
						//x.data = { success: t/f, message:"" }
						this.currentStatus = x.data.success ? STATUS_SUCCESS : STATUS_FAILED;
						if (x.data.success) {
							this.currentStatus = STATUS_SUCCESS;
						} else {
							this.currentStatus = STATUS_FAILED;
							this.uploadError = x.data.message;
						}
					})
					.catch(err => {
						this.uploadError = err.response;
						this.currentStatus = STATUS_FAILED;
					});
			},
			filesChange(fieldName, fileList) {
				if (!fileList.length) return;
				
				this.fileList = fileList;
				
				// append the files to a form & save
				const formData = new FormData();
				Array
					.from(Array(fileList.length).keys())
					.map(x => {
						formData.append(fieldName, fileList[x], fileList[x].name);
					});
				this.save(formData);
			}
		},
		mounted() {
			this.reset();
		},
	});
	Vue.component('user-list',{
		name: 'UserList',
		template: '#template-user-list',
		data() {
			return {
				users: [],
				page: 0,
				perpage: 20,
				total: 1,
				selectedUser: null
			}
		},
		computed: {
		},
		async created() {
			const getUsersForPage = await http.get('/api/users', {
				responseType: 'json'
			});
			this.updateUser(getUsersForPage.data);
		},
		methods: {
			updateUser(data){
				this.page = data.page;
				this.perpage = data.perpage;
				this.total = data.total;
				this.users = this.users.concat(data.users);
			},
			initial(name){
				return name.charAt(0);
			},
			selectUser(user){
				this.selectedUser = user;
				if(!this.selectedUser.matches){
					this.getMatches();
				}
			},
			async getMatches(){
				let matches = await http.get('/api/users/' + this.selectedUser._id + '/matches');
				this.updateMatches(matches.data);
			},
			updateMatches(data){
				this.selectedUser = Object.assign({},this.selectedUser,{ 'matches': data.matches });
			}
		},
		mounted() {
		},
	});
	let app = new Vue({
		el: '#app',
		data: { }
	});
})(Vue, axios);