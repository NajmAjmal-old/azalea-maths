import patcher from "../patcher";
import utilities from "../utilities";
import handlers from "../handlers";

const { cuteName, lazyModule, findReact, getImage } = utilities;
const { Theming, preferences } = handlers;

export default async function() {
    const labelNodes = await lazyModule(() => document.getElementsByClassName("status-bar-label-text")) as HTMLCollectionOf<Element>;
    const statusNode = await lazyModule(() => document.getElementsByClassName("status"));
    const StatusBar = findReact(statusNode[0]);

    patcher.after("render", StatusBar.__proto__, function(_, res) {
        if (!this.props.menuItems) return;

        function onCycleTheme() {
            preferences.set(
                "themeIndex", 
                Theming.themes[Theming.current + 1] ? Theming.current + 1 : 0
            )

            Theming.setTheme(labelNodes[0]);
        }

        function onToggleName() {
            const setNameToString = (value: string) => (labelNodes[1].textContent = value);

            preferences.set("name", !preferences.get("name"));
            preferences.get("name") 
                ? setNameToString(cuteName) 
                : setNameToString(preferences.get("realName"));
        }

        const newItems = [
            {
                text: "Cycle theme",
                img: getImage("menu_theme.png"), // Note: This can take in any image link, but the size of the icon isn't predefined
                hoverImg: getImage("menu_theme_hover.png"),
                action: onCycleTheme.name,
                keyBinding: null,
                newBadge: false
            },
            {
                text: `${preferences.get("name") ? "Disable" : "Enable"} name`,
                img: getImage("menu_name.png"),
                hoverImg: getImage("menu_name_hover.png"),
                action: onToggleName.name,
                keyBinding: null,
                newBadge: false
            }
        ]
        
        Object.assign(this.props, { onCycleTheme, onToggleName });

        // Ensure that the components from this patch haven't been added already
        // Reassign to menuItems because `push` returns a copy of the List
        newItems.forEach(newItem => {
            for (const [idx, oldItem] of this.props.menuItems.entries()) {
                newItem.action === oldItem.get("action") 
                    && (this.props.menuItems = this.props.menuItems.delete(idx));
            }

            this.props.menuItems = this.props.menuItems.push($I.fromJS(newItem));
        })

        return res;
    })
}