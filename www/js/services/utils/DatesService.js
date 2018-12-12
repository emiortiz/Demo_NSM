"user strict";

angular.module('NacionSegurosApp')

.service('DatesService', function() {

    /****************/
    /* PUBLIC METHODS
    /****************/
    return {
        getNowDate: getNowDate,
        getThubanDate: getThubanDate
    }

    /****************/
    /* PRIVATE METHODS
    /****************/
    function getNowDate() {
        var nowDate = new Date();
        
        var result = ('0' + nowDate.getDate()).slice(-2);
        result += '/' + ('0' + (nowDate.getMonth() + 1)).slice(-2);
        result += '/' + nowDate.getFullYear();

        return result;
    };
    
    function getThubanDate() {
        var nowDate = new Date();
        
        var result = nowDate.getFullYear();
        result +=  ('0' + (nowDate.getMonth() + 1)).slice(-2);
        result +=  ('0' + nowDate.getDate()).slice(-2);
        result +=  ' 00:00:00';

        return result;
    };
});
