import {Analises} from '/both/collections/analise';

let template;

Template.editar_analise.onCreated(function () {

    template = Template.instance();
    template.id = FlowRouter.getParam('_id');
    template.analise = new ReactiveVar({});

    template.autorun(function () {
        let analise = Analises.findOne({_id: template.id});
        template.analise.set(analise);
        console.log(analise);
    });

});

Template.editar_analise.helpers({
    'analise': function(){
        return Template.instance().analise.get();
    }
});

Template.editar_analise.events({
    'click #editar-analise': function(event){
        event.preventDefault();

        let rede_social = $('#rede-social').val();
        let url = $('#url').val();
        let descricao = $('#descricao').val();
        console.log("opaaa: ",rede_social,url,descricao);

        let analise_obj = {
            id: template.id,
            rede_social: rede_social,
            url: url,
            descricao: descricao,
        }

        Meteor.call("editar_analise", analise_obj, function(error, result){
            if(error){
                Bert.alert(error, "danger", "growl-top-right");
            }else{
                Bert.alert("Análise editada com sucesso", "success", "growl-top-right");
                FlowRouter.go("/visu_analise/"+template.id);
            }

        })
    },
});