/**
 * Created by lidiaferreira on 7/29/16.
 */

import {Analises} from '/both/collections/analise';

let template;

Template.visu_analise.onCreated(function () {

    template = Template.instance();
    template.id = FlowRouter.getParam('_id');
    template.analise = new ReactiveVar({});

    template.autorun(function () {
        let analise = Analises.findOne({_id: template.id});
        template.analise.set(analise);
    });

});


Template.visu_analise.helpers({
    'analise': function(){
        return Template.instance().analise.get();
    },
    'minhas_modelagens': function () {
        let analise = template.analise.get();
        if(!analise)
            return [];
        return analise.modelagens;
    },
    'esta_vazio': function(){
        let analise = template.analise.get();
        if(!analise)
            return true;
        if(!analise.modelagens)
            return true;

        return analise.modelagens.length === 0;
    }
});

Template.visu_analise.events({
    'click #criar-modelagem': function(event){
        event.preventDefault();
        console.log("opaaa modelagem: ");

        let IdRota = FlowRouter.getParam('_id');
        FlowRouter.go("/criar_modelagem/"+IdRota);
    },
    'click [name="excluir-modelagem"]': function () {

        let excluir_obj = {
            id_modelagem: this.id,
            id_analise: template.id
        }
        console.log(excluir_obj);

        Meteor.call("excluir_modelagem", excluir_obj, function(error, result){
            if(error){
                Bert.alert(error, "danger", "growl-top-right");
            }else{
                Bert.alert("Modelagem excluida com sucesso", "success", "growl-top-right");
            }
        });
    }
});