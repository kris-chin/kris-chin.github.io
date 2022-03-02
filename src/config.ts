/*
    config.ts
    
    Config file (I'm not sure if I'm allowed to do this in prod environment but since I'm not storing secrets, this is okay)
*/

var config = {
    CONTROLS : false, //enable full orbit controls?
    DEBUG_MODE: false, //enable object debug mode?
    SHOW_SCROLL: false, //for desktop, shows scroll percent
    SCROLL_SNAP: false //snap to keyframes?
}

export default config;
