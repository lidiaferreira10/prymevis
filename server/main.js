import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

    const admin = {
        email: 'admin@admin',
        password: 'asdfasdf',
        nome: 'nome do administrador',
        roles: ['administrador']
    };

    const entrevistador = {
        email: 'e1@entrevistador',
        password: 'asdfasdf',
        nome: 'entrevistador',
        roles: ['entrevistador'],
    };

    console.log("Iniciando o arquivo fixtures.js");

// cria usuario se nao existe nenhum
    if(Meteor.users.find().count() === 0) {

        console.log("Nenhum usuario localizando no banco.\n Criando usuarios iniciais...");

        let userId = Accounts.createUser({ email:admin.email, password:admin.password });
        // Roles.addUsersToRoles(userId, admin.roles);
        console.log("Usuario <", admin.email, "> com senha <", admin.password,
            "> foi criado com o papel de <", admin.roles[0], ">");

        userId = Accounts.createUser({ email:entrevistador.email, password:entrevistador.password });
        // Roles.addUsersToRoles(userId, entrevistador.roles);
        console.log("Usuario <", entrevistador.email, "> com senha <", entrevistador.password,
            "> foi criado com o papel de <", entrevistador.roles[0], ">");
    }


});
