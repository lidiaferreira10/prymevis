/**
 * Created by lidiaferreira on 7/28/16.
 */
Template.header.events({
   'submit form': function(event){
       event.preventDefault();
       console.log("log do login");
       let login = $('#user-login').val();
       let senha = $('#pass-login').val();

       console.log(login, senha);

       Meteor.loginWithPassword(login, senha, function(error) {
           if(error) {
               Bert.alert(error.reason, 'danger', 'growl-top-right', 'fa-frown-o');
               return;
           }else{
               FlowRouter.go('index_sis');
               $('.modal').modal('toggle');
           }
       });
    },
    'click #logout-link': function () {
        Meteor.logout(function() {
                Bert.alert('Usuário deslogado com sucesso.', 'success', 'growl-top-right');
                FlowRouter.go("index");
            }
        )

    }
});


Template.header.helpers({
    'autenticado': function () {
        return !Meteor.loggingIn() && Meteor.user();
    },
    'email_user': function () {
        let user = Meteor.user();
        if (!user){
            return "to pronto nao vei";
        }else{
            return user.emails[0].address;
        }
    }
});