/**
 * Created by lidiaferreira on 8/2/16.
 */

import {Analises} from '/both/collections/analise';

let template;

Template.criar_modelagem.onCreated(function () {

    template = Template.instance();
    template.id = FlowRouter.getParam('_id');
    template.analise = new ReactiveVar();

    template.estaCarregando = new ReactiveVar(true);

    template.autorun(function () {
        let analise = Analises.findOne({_id: template.id});
        template.analise.set(analise);
    });

});

Template.criar_modelagem.onRendered(function () {
    $(document).ready(function () {
        criarColmeia();
        setTimeout(function () {
            template.estaCarregando.set(false);
        }, 2000);
    });
});

Template.criar_modelagem.helpers({
    'rede_social': function(){

        let redeSocial_obj = template.analise.get();

        if(redeSocial_obj === undefined){
            return "to pronto nao jovem";
        }else{
            return redeSocial_obj.rede_social;
        }
    },
    'estaCarregando': function () {
        return template.estaCarregando.get();
    },
    'display': function () {
        if(template.estaCarregando.get() ){
            return "hidden;";
        }else{
            return "visible";
        }
    }
});

Template.criar_modelagem.events({
    "click #salvar-modelagem": function () {
        let Nome = $("#nome-modelagem").val();
        let selects = $("select").map((i,select) => {
            return($(select).find("option:selected").val());
        });

        let FontInfo = {controle: selects[0], valor: selects[1]};
        let EspaComu = {controle: selects[2], valor: selects[3]};
        let InfoIndi = {controle: selects[4], valor: selects[5]};
        let PersTemp = {controle: selects[6], valor: selects[7]};
        let Audienci = {controle: selects[8], valor: selects[9]};
        let Notifica = {controle: selects[10], valor: selects[11]};
        let DiscSist = {controle: selects[12], valor: selects[13]};
        let DissInfo = {controle: selects[14], valor: selects[15]};

        let colmeia_info = {
            id: Random.id(),
            nome: Nome,
            fontinfo: FontInfo,
            espacomu: EspaComu,
            infoindi: InfoIndi,
            perstemp: PersTemp,
            audienca: Audienci,
            notifica: Notifica,
            discsist: DiscSist,
            dissinfo: DissInfo,

        }
        console.log(colmeia_info);

        let id = FlowRouter.getParam('_id');

        Meteor.call("salvar_modelagem", id,colmeia_info, function (error) {
            if (error){
                Bert.alert("Erro ao salvar modelagem. Tente novamente.", "danger", "growl-top-right");
            }else{
                Bert.alert("Modelagem salva com sucesso", "success", "growl-top-right");
                FlowRouter.go("/visu_analise/"+id);
            }
        });
    },
    'click #cancelar-modelagem': function () {
        FlowRouter.go("/visu_analise/" + template.id);
    },
});