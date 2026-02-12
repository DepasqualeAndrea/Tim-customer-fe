$(document).ready(function() {

    // Aggiungere classe da Angular quando l'input è prefillato

    function moveLabelUp(input) {
        $input = input;
        $input.parent().addClass('filled');
    }

    function moveLabelDown(input) {
        $input = input;
        if ($input.val() == '') {
            $input.parent().removeClass('filled');
        }
    }

    $('input, textarea').focus(function() {
        $this = $(this);
        moveLabelUp($this);
    });

    $('input, textarea').blur(function() {
        $this = $(this);
        moveLabelDown($this);
    });

});