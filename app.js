const express    = require('express');
const exphbs     = require('express-handlebars');
const app        = express();
const path       = require('path');
const db         = require('./db/connection');
const bodyParser = require('body-parser');
const Job        = require('./models/Job');
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op;

const PORT = 3000;

// Fazendo escutar porta 3000
app.listen(PORT, function(){
    console.log(`O Express está rodando na porta ${PORT}`);
})

// handle bars
app.set('views', path.join(__dirname, 'views')); // definindo diretorio das views, onde fica templates do projeto
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'})); // arquivo principal de layout
app.set('view engine', 'handlebars'); // dizendo qual biblioteca/framework vai renderizar as views

// static folder
app.use(express.static(path.join(__dirname, 'public'))); // definindo diretorio de arquivos estaticos

// body parser ---> para conseguir resgatar o corpo da requisição
app.use(bodyParser.urlencoded({ extended: false }));

// db connection
db
    .authenticate()
    .then(() => {
        console.log("Conectou ao banco de dados com sucesso!");
    })
    .catch(err => {
        console.log("Ocorreu erro ao conectar", err);
    });

// routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%'; // PH -> PHP, Word -> Wordpress, press -> Wordpress

    if(!search){

        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
    
            res.render('index', {
                jobs
            });
        })
        .catch(err => console.log(err));

    } else{

        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
                ['createdAt', 'DESC']
        ]})
        .then(jobs => {
    
            res.render('index', {
                jobs, search
            });
        })
        .catch(err => console.log(err));
    }

})

// jobs routes
app.use('/jobs', require('./routes/jobs'));