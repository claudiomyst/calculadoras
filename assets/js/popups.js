var $jq = jQuery.noConflict();
$jq(document).ready(function(){

    // Abrindo os popups
    $jq(document).on('click', '.open-popup', function(){
        // let openPopup = '#' + $jq(this).attr('id');

        let openPopup = '#' + $jq(this).data('id');
        let popup = $jq(openPopup + '-popup');
        
        $jq('.popup.opened').fadeOut(0).removeClass('opened');
        
        centerAndOpenPopup(popup);
        makePopupDraggable(popup);
    });


    // Fechando o popup
    $jq(document).on('click', '.icon-close', function(){
        $jq(this).closest('.popup').hide().removeClass('opened');
    });


    // Centralizando os popups na tela ao abrí-los
    function centerAndOpenPopup(popup) {
        let windowWidth  = $jq(window).width();
        let windowHeight = $jq(window).height();
        let popupWidth   = popup.outerWidth();
        let popupHeight  = popup.outerHeight();
        let posX         = (windowWidth - popupWidth) / 2;
        let posY         = (windowHeight - popupHeight) / 2;

        popup.css({
            'left'   : posX,
            'top'    : posY
        });
        popup.fadeIn(200).addClass('opened');
    }



    // Permitindo arrastar os popups pela tela
    function makePopupDraggable(popup) {
        let initialMouseX, initialMouseY, initialPopupX, initialPopupY;

        popup.find('.header-inner').on("mousedown", function(event) {
            event.preventDefault();

            initialMouseX = event.clientX;
            initialMouseY = event.clientY;

            let popupRect = popup[0].getBoundingClientRect();
            initialPopupX = popupRect.left;
            initialPopupY = popupRect.top;

            $jq(document).on("mousemove", dragPopup);
            $jq(document).on("mouseup", stopDrag);
        });

        function dragPopup(event) {
            let deltaX = event.clientX - initialMouseX;
            let deltaY = event.clientY - initialMouseY;

            popup.css({
                'left'   : initialPopupX + deltaX + "px",
                'top'    : initialPopupY + deltaY + "px"
            });
        }

        function stopDrag() {
            $jq(document).off("mousemove", dragPopup);
            $jq(document).off("mouseup", stopDrag);
        }
    }

});