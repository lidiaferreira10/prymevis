/**
 * Created by lidiaferreira on 8/1/16.
 */
Template.cadastrar_usuario.onCreated( function () {
    $('.modal').modal('toggle');
});

Template.cadastrar_usuario.events({
    'submit form': function(event){
        event.preventDefault();
        console.log("log do cadastro");
        let nome = $('#firstname').val();
        let sobrenome = $('#lastname').val();
        let email = $('#email').val();
        let senha = $('#password').val();

        let usuario_obj = {nome:nome, sobrenome:sobrenome, email:email, senha:senha};


        Meteor.call('usuarios.adicionarUsuario', usuario_obj, function(error){
            if(error){
                Bert.alert(error.reason, 'danger', "growl-top-right");
            }else{
                Bert.alert("Usuário(a) cadastrado(a) com sucesso.", 'success', "growl-top-right");
                Meteor.loginWithPassword(email, senha, (error) => {

                    if(error) {
                        Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                        return false;
                    }else{
                        FlowRouter.go("index_sis");
                    }
                });
            }
        } );
    },
    'click #cancelar-cadastro': function () {
        FlowRouter.go("index");
    },
});