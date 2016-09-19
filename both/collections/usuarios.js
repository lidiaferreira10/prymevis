/**
 * Created by lidiaferreira on 8/1/16.
 */
export const Usuarios = Meteor.users;

Meteor.methods({
    'usuarios.adicionarUsuario' (usuario_obj){
        console.log(usuario_obj);

        let userId = Accounts.createUser({
            nome: usuario_obj.nome,
            sobrenome: usuario_obj.sobrenome,
            email: usuario_obj.email,
            usuario: usuario_obj.usuario,
            password: usuario_obj.senha,
        });

        return true;
    }
});