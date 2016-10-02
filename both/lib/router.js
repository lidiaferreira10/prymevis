/**
 * Created by lidiaferreira on 7/27/16.
 */

/** Funcao para fazer a autenticacao do login*/
const authenticatedRedirect = ( context, redirect ) => {
    if ( !Meteor.userId() ) {
        redirect('index');
    }
};

FlowRouter.route('/blog/:postId', {
    action: function(params, queryParams) {
        console.log("Params:", params);
        console.log("Query Params:", queryParams);
    },

    name: "<name for the route>" // optional
});

FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render('default', { yield: 'index'});
    },
    name: "index" // optional
});

FlowRouter.route('/login', {
    action: function() {
        console.log("to aqui colega");
        BlazeLayout.render('default', { yield: 'login'});
    },
    name: "login" // optional
});

FlowRouter.route('/sobre', {
    action: function() {
        BlazeLayout.render('default', { yield: 'sobre'});
    },
    name: "sobre" // optional
});

FlowRouter.route('/modelo', {
    action: function() {
        BlazeLayout.render('default', { yield: 'modelo'});
    },
    name: "modelo" // optional
});
FlowRouter.route('/ferramenta', {
    action: function() {
        BlazeLayout.render('default', { yield: 'ferramenta'});
    },
    name: "ferramenta" // optional
});
FlowRouter.route('/cadastrar_usuario', {
    action: function() {
        BlazeLayout.render('default', { yield: 'cadastrar_usuario'});
    },
    name: "cadastrar_usuario" // optional
});
FlowRouter.route('/redefinir_senha', {
    action: function() {
        BlazeLayout.render('default', { yield: 'redefinir_senha'});
    },
    name: "redefinir_senha" // optional
});


/** GRUPOS AUTENTICADOS **/

const RotasAutenticadas = FlowRouter.group({
    name: 'autenticados',
    triggersEnter: [ authenticatedRedirect ]
});

RotasAutenticadas.route('/index_sis', {
    action: function() {
        BlazeLayout.render('default', { yield: 'index_sis'});
    },
    name: "index_sis" // optional
});

RotasAutenticadas.route('/criar_analise', {
    action: function() {
        BlazeLayout.render('default', { yield: 'criar_analise'});
    },
    name: "criar_analise" // optional
});

RotasAutenticadas.route('/visu_analise/:_id', {
    action: function() {
        BlazeLayout.render('default', { yield: 'visu_analise'});
    },
    name: "visu_analise" // optional
});

RotasAutenticadas.route('/criar_modelagem/:_id', {
    action: function() {
        BlazeLayout.render('default', { yield: 'criar_modelagem'});
    },
    name: "criar_modelagem" // optional
});

RotasAutenticadas.route('/editar_modelagem/:_id_analise/:_id_modelagem', {
    action: function() {
        BlazeLayout.render('default', { yield: 'editar_modelagem'});
    },
    name: "editar_modelagem" // optional
});

RotasAutenticadas.route('/visu_modelagem/:_id_analise/:_id_modelagem', {
    action: function() {
        BlazeLayout.render('default', { yield: 'visu_modelagem'});
    },
    name: "visu_modelagem" // optional
});

RotasAutenticadas.route('/editar_analise/:_id', {
    action: function() {
        BlazeLayout.render('default', { yield: 'editar_analise'});
    },
    name: "editar_analise" // optional
});