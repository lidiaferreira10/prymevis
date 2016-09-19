/**
 * Created by lidiaferreira on 7/29/16.
 */
Template.criar_analise.events({
    'click #salvar-analise': function(event){
        event.preventDefault();

        let rede_social = $('#rede-social').val();
        let url = $('#url').val();
        let descricao = $('#descricao').val();
        console.log("opaaa: ",rede_social,url,descricao);

        let modelagem_obj = {
            rede_social: rede_social,
            url: url,
            descricao: descricao,
            modelagens: [],
        }

        Meteor.call("criar_analise", modelagem_obj, function(error, result){
            if(error){
                Bert.alert(error, "danger", "growl-top-right");
            }else{
                Bert.alert("Análise cadastrada com sucesso", "success", "growl-top-right");
                FlowRouter.go("/visu_analise/"+result);
            }

        })
    },
    'click #cancelar-analise': function (event) {
      return FlowRouter.go("/index_sis/");
    },
});