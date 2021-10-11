const express = require('express');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const app = express();
const porta = 3000;
const saltRounds = 10;
//const alunoDao = require('./aluno-dao');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123",
    database: 'appdauma'
});

// Estabelece conexão com o banco
con.connect(function(err) {
    if (err) {
        console.error('Erro de conexão: ' + err.stack);
        return;
    }
    console.log('Conectado com ID: '+ con.threadId);
});

// define o módulo de template que o Express irá carregar
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
// Set public path
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
}));
  
app.use(flash());

// renderiza a página de login
app.get('/', function(req, res) {
    res.render('login', {loginStatus: req.flash('login-fail')});
});

// processa a requisição de login do usuário
app.post('/logar', function (req, res) {
    let usuario = req.body.usuario;
    let senha = req.body.senha;
    let usuarios = [["arnaldo", "uma123"], ["quenidi", "uma123"]];

    for (let x=0; x<usuarios.length; x++) {
        if (usuarios[x][0] == usuario) {
            if (usuarios[x][1] == senha) {
                //res.render('alunos', { usuario: usuario });
                res.redirect('/alunos');
            } else {
                req.flash('login-fail', 'Usuário ou senha incorretos!')
                res.redirect("/");
            }
        }
    }
});

app.get('/alunos', function(req, res) {
    try {
        con.query('SELECT a.nome, a.cpf, a.telefone, a.escolaridade, c.nome AS cidade FROM alunos a INNER JOIN cidades c ON a.cidade_id = c.id', (err, alunos) => {
            if (err) throw err;
            res.render('alunos', {alunos: alunos});
        });
    } catch(err) {
        next(err);
    }
});

// renderiza a página de cadastro de alunos
app.get('/cadastrar_aluno', function(req, res) {
    try {
        con.query('SELECT * FROM estados', function(err, estados) {
            if (err) throw err;
            console.log(estados);
    
            con.query('SELECT * FROM cidades', (err, cidades) => {
                if (err) throw err;
                console.log(cidades);
                res.render('cadastrar_aluno', { estados: estados, cidades: cidades, mensagem: req.flash('sucesso') });
            });
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Busca o aluno selecionado, os estados e as cidades e renderiza a página de atualização de aluno
 */
app.get('/atualizar_aluno/:cpf', function(req, res) {
    try {
        var sql = 'SELECT * FROM alunos WHERE cpf = ?';
        var alunoId = req.params.cpf;
        con.query(sql, alunoId, (err, aluno) => {
            con.query('SELECT * FROM estados', (err, estados) => {
                con.query('SELECT * FROM cidades', (err, cidades) => {
                    res.render('atualizar_aluno', { aluno: aluno, estados: estados, cidades: cidades, mensagem: req.flash('sucesso') });
                })
            });
        });
    } catch (err) {
        next(err);
    }
});

// persiste o aluno no BD
app.post('/persistir_aluno/:caller', function(req, res) {
    try {
        var sql;
        var caller = req.params.caller;
        var aluno = {
            nome: req.body.nome,
            cpf: req.body.cpf,
            endereco: req.body.endereco,
            bairro: req.body.bairro,
            cidade_id: req.body.cidade,
            cep: req.body.cep,
            telefone: req.body.telefone,
            email: req.body.email,
            data_nascimento: req.body.data_nascimento,
            sexo: req.body.sexo,
            profissao: req.body.profissao,
            escolaridade: req.body.escolaridade,
            estado_civil: req.body.estado_civil,
            mora_sozinho: req.body.mora_sozinho,
            tem_transporte: req.body.tem_transporte,
            pessoa_para_contato: req.body.pessoa_para_contato,
            fone_do_contato: req.body.fone_do_contato
        };

        if (caller == "cadastrar") {
            sql = "INSERT INTO alunos SET ?";

            con.query(sql, aluno, function(err, result) {
                if (err) {
                    req.flash('sucesso', 'Erro ao cadastrar aluno!');
                    res.redirect('/cadastrar_aluno');
                } else {
                    req.flash('sucesso', 'Cadastro realizado com sucesso!');
                    res.redirect('/cadastrar_aluno'); 
                }
            });
        } else {
            sql = "UPDATE alunos SET ? WHERE id = ?";

            con.query(sql, [aluno, req.body.id], function(err, result) {
                if (err) {
                    throw err;
                } else {
                    req.flash('sucesso', 'Atualização realizada com sucesso!');
                    res.redirect(`/atualizar_aluno/${aluno.cpf}`);
                }
            });            
        }
    } catch (erro) {
        next(erro);
    }
});

// renderiza a página de cadastro de usuários
app.get('/cadastrar_usuario', function(req, res) {
    try {
        res.render('cadastrar_usuario', { mensagem: req.flash('sucesso') });
    } catch (err) {
        next(err);
    }
});

app.post('/persistir_usuario', (req, res) => {
    try {
        var usuario = {
            nome: req.body.nome,
            email: req.body.email,
            usuario: req.body.usuario,
            senha: req.body.senha
        };
        // cria uma senha hash
        usuario.senha = bcrypt.hash(usuario.senha, saltRounds);

        var sql = "INSERT INTO usuarios SET ?";

        con.query(sql, usuario, (erro, result) => {
            if (erro) {
                req.flash('sucesso', 'Erro ao cadastrar usuário!');
                res.redirect('/cadastrar_usuario');
            } else {
                req.flash('sucesso', 'Cadastro realizado com sucesso!');
                res.redirect('/cadastrar_usuario'); 
            }
        });

    } catch (err) {
        next(err);
    }
});

app.listen(porta);