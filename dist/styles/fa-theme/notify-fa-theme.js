$.notify.addStyle("fa-theme", {
    html:
        "<div>" +
            "<div class='image' data-notify-html='image'/>" +
            "<div class='text-wrapper'>" +
                "<div class='title' data-notify-html='title'/>" +
                "<div class='text' data-notify-html='text'/>" +
            "</div>" +
        "</div>",
    classes: {
        error: {
            "color": "#fff !important",
            "background-color": "#ff5959",
        },
        success: {
            "color": "#fff !important",
            "background-color": "#239d60",
        },
        info: {
            "color": "#fff !important",
            "background-color": "#2aa9d2",
        },
        warning: {
            "background-color": "#facf5a",
        },
        black: {
            "color": "#fff !important",
            "background-color": "#333",
        },
        white: {
            "background-color": "#fff",
        }
    }
});
