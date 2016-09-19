/**
 * Created by lidiaferreira on 7/28/16.
 */

import {Analises} from "../../../both/collections/analise"

let template;

Template.index_sis.onCreated(function () {

    template = Template.instance();
});

Template.index_sis.events({
    'click #nova-analise': function(event){
        event.preventDefault();
        console.log("log do botao");

        FlowRouter.go("criar_analise");
    },
    'click [name="excluir-analise"]': function (event) {
        event.preventDefault();
        console.log(this);
        Meteor.call("excluir_analise", this._id);
    }
});

Template.index_sis.helpers({
    'nome_user': function () {
        let user = Meteor.user();
        if (!user){
            return "to pronto nao vei";
        }else{
            return user.emails[0].address;
        }
    },
    'minhas_analises': function () {
        let analises = Analises.find({}).fetch();
        console.log(analises);
        return analises;
    },
    'esta_vazio': function(){
       return Analises.find().fetch().length === 0;
    }
});
