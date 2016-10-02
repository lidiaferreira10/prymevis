/**
 * Created by lidiaferreira on 10/2/16.
 */
import {Analises} from '/both/collections/analise';

let template;

Template.visu_modelagem.onCreated(function () {

    template = Template.instance();
    template.id_analise = FlowRouter.getParam('_id_analise');
    template.id_modelagem = FlowRouter.getParam('_id_modelagem');
    template.analise = new ReactiveVar();
    template.modelagem = new ReactiveVar();

    template.estaCarregando = new ReactiveVar(true);

    template.autorun(function () {
        let analise = Analises.findOne({_id: template.id_analise});
        console.log(analise);
        template.analise.set(analise);

        if(analise){
            for (let i = 0; i < analise.modelagens.length; i++) {
                let modelagem_obj = analise.modelagens[i];

                if (modelagem_obj.id === template.id_modelagem) {
                    console.log(modelagem_obj);
                    template.modelagem.set(modelagem_obj);

                }
            }
        }
    });
});

Template.visu_modelagem.onRendered(function () {

    criarColmeia();

    setTimeout(function () {

        let selects = $("select");

        $(selects[0]).find('option[value="'+ template.modelagem.get().fontinfo.controle +'"]').prop("selected", "selected");
        $(selects[0]).find('option[value="'+ template.modelagem.get().fontinfo.controle +'"]').prop("selected", "selected");
        $(selects[1]).find('option[value="'+ template.modelagem.get().fontinfo.valor +'"]').prop("selected", "selected");
        $(selects[2]).find('option[value="'+ template.modelagem.get().espacomu.controle +'"]').prop("selected", "selected");
        $(selects[3]).find('option[value="'+ template.modelagem.get().espacomu.valor +'"]').prop("selected", "selected");
        $(selects[4]).find('option[value="'+ template.modelagem.get().infoindi.controle +'"]').prop("selected", "selected");
        $(selects[5]).find('option[value="'+ template.modelagem.get().infoindi.valor +'"]').prop("selected", "selected");
        $(selects[6]).find('option[value="'+ template.modelagem.get().perstemp.controle +'"]').prop("selected", "selected");
        $(selects[7]).find('option[value="'+ template.modelagem.get().perstemp.valor +'"]').prop("selected", "selected");
        $(selects[8]).find('option[value="'+ template.modelagem.get().audienca.controle +'"]').prop("selected", "selected");
        $(selects[9]).find('option[value="'+ template.modelagem.get().audienca.valor +'"]').prop("selected", "selected");
        $(selects[10]).find('option[value="'+ template.modelagem.get().notifica.controle +'"]').prop("selected", "selected");
        $(selects[11]).find('option[value="'+ template.modelagem.get().notifica.valor +'"]').prop("selected", "selected");
        $(selects[12]).find('option[value="'+ template.modelagem.get().discsist.controle +'"]').prop("selected", "selected");
        $(selects[13]).find('option[value="'+ template.modelagem.get().discsist.valor +'"]').prop("selected", "selected");
        $(selects[14]).find('option[value="'+ template.modelagem.get().dissinfo.controle +'"]').prop("selected", "selected");
        $(selects[15]).find('option[value="'+ template.modelagem.get().dissinfo.valor +'"]').prop("selected", "selected");

        //funcao para atualizar cores e bordas depois que carregue a pagina
        for (let i=0; i< controlsPDM.length; i++){
            updateControlPrivacy.call(selects[2*i], controlsPDM[i]);
            updatePrivacyLevel.call(selects[2*i+1], controlsPDM[i]);
        };

        //desabilita todos os campos para visualizacao
        $("#colmeia").find("input").attr('disabled', 'disabled');
        $("#colmeia").find("select").attr('disabled', 'disabled');

        setTimeout(function () {
            template.estaCarregando.set(false);
        }, 1000);

    }, 1000);


});

Template.visu_modelagem.helpers({
    'rede_social': function(){

        let redeSocial_obj = template.analise.get();

        if(redeSocial_obj === undefined){
            return "to pronto nao jovem";
        }else{
            return redeSocial_obj.rede_social;
        }
    },
    'modelagem': function () {
        return template.modelagem.get();

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

Template.visu_modelagem.events({
    'click #voltar-modelagem': function () {
        FlowRouter.go("/visu_analise/" + template.id_analise);
    },
});