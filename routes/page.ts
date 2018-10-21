/**
 * Page module for all page URL endpoints
 * @param router express.Router
 * @param db MongoDb.client.db
 * @returns router express.Router
 */
function Page(router){
    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Close2Home | Homepage' });
    });
    router.get('/upload', function(req, res, next) {
        res.render('upload', { title: 'Close2Home | Upload csv file' });
    });

    return router;
}

module.exports = Page;
