import { savePreferences } from '../Actions/bookActions'

export function changePreferences(dispatch, rendition, preferences, confirmedPreferences) {
    if (preferences === null) {
        preferences = confirmedPreferences;
    }
    let theme = {};
    let htmlComponents = ['head', 'div', 'body', 'p', 'span'];
    htmlComponents.forEach(comp => {
        theme[comp] = {
            "font-size": preferences.fontSize + "px !important",
            color: preferences.fontColor + ' !important',
            background: preferences.backgroundColor + ' !important',
            "font-family": preferences.fontFamily + ' !important',
            "line-height": preferences.lineHeight + ' !important',
            "letter-spacing": preferences.letterSpacing + "px !important",
        }
    })
    dispatch(savePreferences(preferences))
    rendition.themes.default(
        theme
    );

}