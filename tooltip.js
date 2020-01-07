function tooltipDemo() {
    $('#abc').showToolTip({
        Title: 'Title',
        Content: 'Content',
        onApprove: function () {
            //console.log("okay clicked")
        } 
    });
}

(function( $ ) {
    function createToolTip(config) {
        var tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");

        var title = document.createElement("h6");
        title.innerHTML = config.Title;
        //title.classList.add("tooltiptext");

        var content = document.createElement("p");
        content.innerHTML = config.Content;
        //content.classList.add("tooltiptext");

        var btn = document.createElement("button");
        btn.innerHTML = "Okay";
        btn.addEventListener("click", function(evt) {
            this.parentNode.parentNode.removeChild(this.parentNode);
            document.getElementById('show-btn').hidden = false;
            config.onApprove()
        });

        tooltip.append(title, content, btn);
        return tooltip;
    }

    $.fn.showToolTip = function( config ) {
        var tooltip = createToolTip(config);
        document.getElementById('show-btn').hidden = true;
        this.append(tooltip);
        return this;
    }
})( jQuery );
