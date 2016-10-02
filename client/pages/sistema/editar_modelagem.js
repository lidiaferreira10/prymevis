import {Analises} from '/both/collections/analise';

let template;

Template.editar_modelagem.onCreated(function () {

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

Template.editar_modelagem.onRendered(function () {

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

       setTimeout(function () {
           template.estaCarregando.set(false);
       }, 1000);

   }, 1000);


});

Template.editar_modelagem.helpers({
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

Template.editar_modelagem.events({
    'click #salvar-modelagem': function () {
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
            id: template.id_modelagem,
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

        Meteor.call("editar_modelagem", template.id_analise, colmeia_info, function (error) {
            if (error){
                Bert.alert("Erro ao editar modelagem. Tente novamente.", "danger", "growl-top-right");
            }else{
                Bert.alert("Modelagem editada com sucesso", "success", "growl-top-right");
                FlowRouter.go("/visu_analise/"+ template.id_analise);
            }
        });
    },
    'click #cancelar-modelagem': function () {
        FlowRouter.go("/visu_analise/" + template.id_analise);
    },
});