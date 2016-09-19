/**
 * Created by lidiaferreira on 7/29/16.
 */
export const Analises = new Mongo.Collection("analises");

Meteor.methods({
    'criar_analise' (analise_obj) {

        let id_analise = Analises.insert(analise_obj);
        return id_analise;
    },
    'editar_analise' (analise_obj){
        Analises.update( {_id: analise_obj.id}, {$set: {rede_social: analise_obj.rede_social, url: analise_obj.url,
            descricao: analise_obj.descricao} } );
    },
    'excluir_analise' (id){
        Analises.remove({_id: id});
    },
    'salvar_modelagem' (id, colmeia_obj){
        Analises.update({_id: id}, {$push: {modelagens: colmeia_obj}}, (error) => {
            if (error) {
                console.log(error);
            }else{
                console.log("Salvo com sucesso");
            }
        });
    },
    'excluir_modelagem' (excluir_obj){
        let analise = Analises.findOne({_id: excluir_obj.id_analise});
        let modelagens = analise.modelagens;
        let modelagens_restantes = [];

        for(let i = 0 ; i < modelagens.length; i++ ){
            if(modelagens[i].id !== excluir_obj.id_modelagem ){
                modelagens_restantes.push(modelagens[i]);
            }
        }
        Analises.update({_id: excluir_obj.id_analise}, {$set: {modelagens: modelagens_restantes} } );
    }
});

