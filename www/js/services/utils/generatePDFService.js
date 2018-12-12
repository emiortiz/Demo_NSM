"user strict";

angular.module('NacionSegurosApp')

.service('generatePDFService',generatePDFService);

generatePDFService.$inject = [
    '$q',
    '$cordovaFile'

];


function generatePDFService($q,$cordovaFile) {

    /****************/
    /* PUBLIC METHODS
    /****************/
    return {
        generatePDF: generatePDF
    }

    /****************/
    /* PRIVATE METHODS
    /****************/
    
    
   

    function boolToString(bool){
        if(bool){
            return 'x';
        }else{
            return '';
        }
    };
    function comparacionToString(palabra,palabraAComparar){
       if(palabra==palabraAComparar){
           return 'x';
       }else{
           return '';
       }
   };
   
   function mostrar(bool,string){
       if(bool){
           return string;
       }else{
            return '';
       }
   };


   function generatePDF(data){
    var deferred = $q.defer();

    var pdf = new jsPDF('p', 'pt', 'a4', true);

    try {
       cargarDatosPersonas(pdf,data);
       cargarDatosPFamiliar(pdf,data);
       cargarDatpsPCajero(pdf,data);
       cargarDatpsPCartera(pdf,data);
       cargarDatosPCompra(pdf,data);
       cargarDatosPTecnologia(pdf,data);
       cargarDatosPPersonal(pdf,data);
       cargarDatosPPrevFamiliar(pdf,data);
       cargarFirma(pdf,data);
       var pdfBlob=pdf.output('blob');
       $cordovaFile.writeFile(cordova.file.externalCacheDirectory, 'formulario.pdf', pdfBlob , true);
       
       deferred.resolve(pdfBlob);
    } catch(e) {
        deferred.reject(e);
    }
   
    return deferred.promise;
}

    function cargarDatosPersonas(pdf,data){            
        pdf.addImage(solicitudPag1, 'jpg', 0, 0, 595, 841, '', 'FAST');
        pdf.text(116, 130, data.name);
        pdf.text(526, 134,comparacionToString(data.gender,'Masculino'));
        pdf.text(545, 134,comparacionToString(data.gender,'Femenino'));
        pdf.text(217,147,data.dni);
        pdf.text(95,188,data.domicilio);
        pdf.text(322,215,data.email);
    }
    function cargarDatosPFamiliar(pdf,data){
        pdf.text(47, 288,boolToString(data.familiar));
    }
    function cargarDatpsPCajero(pdf,data){
        pdf.text(51, 636, boolToString(data.cajero));
        pdf.text(105, 685, mostrar(data.cajero,data.cajeroCuota));
    }
    function cargarDatpsPCartera(pdf,data){
        pdf.text(49, 730, boolToString(data.cartera));
        pdf.text(105, 805,  mostrar(data.cartera,data.carteraCuota));
    }
    function cargarDatosPCompra(pdf,data){
        pdf.addPage('a4')
        pdf.addImage(solicitudPag2, 'jpg', 0, 0, 595, 841, '', 'FAST');
        pdf.text(50, 64, boolToString(data.compra));
        pdf.text(195, 87, comparacionToString(data.compraClasico,'Clasico'));
        pdf.text(333, 87, comparacionToString(data.compraPremium,'Premium'));
    }
    function cargarDatosPTecnologia(pdf,data){
        pdf.text(49, 230,boolToString( data.tecnologia));
    }
    function cargarDatosPPersonal(pdf,data){
        pdf.text(49, 400, boolToString(data.personal));
    }        
    function cargarDatosPPrevFamiliar(pdf,data){
        pdf.text(49, 525, boolToString(data.prevFamiliar));
        pdf.text(117, 633, mostrar(data.prevFamiliar,data.prevFamiliarCuota));
    }
    function cargarFirma(pdf,data){
        pdf.addPage('a4')
        pdf.addImage(solicitudPag3,'jpg', 0, 0, 595, 841, '', 'FAST');
        pdf.addImage(data.firma, 'png', 340, 400, 150, 150);
        pdf.text(98,490,data.fecha)
    }
};