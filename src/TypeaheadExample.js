import { useEffect } from "react";
import "./styles.css";
import { TypeaheadMenu } from "./component/TypeaheadMenu";
import { createRoot } from "react-dom/client";

export default function TypeaheadExample() {
  useEffect(() => {
    handleInput();
  }, []);

  const handleInput = () => {
    let userInputBox;
    if (document.getElementById("listening-input-change")) {
      userInputBox = document.getElementById("listening-input-change");
    } else {
      userInputBox = document.getElementsByClassName("ChatInput")[0];
      userInputBox.setAttribute("id", "listening-input-change");
    }
    ["keyup", "click", "scroll"].forEach(function (event) {
      userInputBox.addEventListener(event, updateMenuLocation);
      document.addEventListener(event, dismissMenuIfInactive);
    });

    window.addEventListener("resize", dismissMenuIfInactive);

    userInputBox.addEventListener("input", function () {
      // console.log("userInputBox", this);
      const position = getCursorLocation(this);
      // console.log("position", position);
      const strippedHtml = this.innerHTML
        .substring(0, position)
        .replace(/<[^>]+>/g, " ");
      const lastWord = strippedHtml.split(" ").pop();
      if (!lastWord || lastWord.length < 3) {
        if (document.getElementById("typeahead-menu")) {
          document.getElementById("typeahead-menu").remove();
        }
        return;
      }
      const menuItems = [
        { label: "Apple", value: "AAPL" },
        { label: "Microsoft", value: "MSFT" },
        { label: "Google", value: "GOOGL" },
        { label: "Amazon", value: "AMZN" },
        { label: "Facebook", value: "FB" },
        { label: "Tesla", value: "TSLA" },
        { label: "Netflix", value: "NFLX" },
      ];
      const companyMatches = menuItems.filter((item) =>
        item.label.toLowerCase().includes(lastWord.toLowerCase())
      ); // TODO: replace with API call
      // console.log(companyMatches);
      if (document.getElementById("typeahead-menu")) {
        document.getElementById("typeahead-menu").remove();
      }

      const coord = getCoordinates();
      // Use these attrs in the following css for the div for autocomplete options

      if (companyMatches.length > 0) {
        const appRoot = document.getElementById("root");
        const typeaheadMenu = document.createElement("div");
        typeaheadMenu.setAttribute("id", "typeahead-menu");
        const root = createRoot(typeaheadMenu);
        typeaheadMenu.style.position = "fixed";
        typeaheadMenu.style.top = `${coord.top}px`;
        typeaheadMenu.style.left = `${coord.left}px`;
        typeaheadMenu.style.minWidth = "400px";
        typeaheadMenu.style.maxHeight = "200px";
        typeaheadMenu.style.zIndex = "9999";
        typeaheadMenu.style.transform = "translateY(-105%)";
        root.render(
          <TypeaheadMenu
            menuItems={companyMatches}
            onClick={(e) =>
              e.currentTarget.dataset.value &&
              updateInput(e.currentTarget.dataset.value)
            }
          />
        );

        // console.log("here creating a typeahead-menu root");
        appRoot.appendChild(typeaheadMenu);
      }
    });
  };

  let cursorPosition;

  const getCoordinates = () => {
    var target = document.createTextNode("\u0001");
    document.getSelection().getRangeAt(0).insertNode(target);
    // Get coordinates via Range
    const range = document.createRange();
    range.selectNode(target);
    const result = range.getBoundingClientRect();
    target.parentNode.removeChild(target);
    return result;
  };

  const updateMenuLocation = () => {
    const typeaheadMenuInstance = document.getElementById("typeahead-menu");
    if (typeaheadMenuInstance) {
      const coord = getCoordinates();
      typeaheadMenuInstance.style.top = coord.top + "px";
      typeaheadMenuInstance.style.left = coord.left + "px";
    }
  };

  const getCursorLocation = (ele) => {
    // console.log("inside getCursorLocation", ele);
    var target = document.createTextNode("\u0001");
    document.getSelection().getRangeAt(0).insertNode(target);
    var position = ele.innerHTML.indexOf("\u0001");
    target.parentNode.removeChild(target);
    cursorPosition = position;
    return position;
  };

  const dismissMenuIfInactive = () => {
    if (
      document.activeElement !==
      document.getElementById("listening-input-change")
    ) {
      // meaning it is not in focus, remove the typeahead menu
      const typeaheadMenuInstance = document.getElementById("typeahead-menu");
      if (typeaheadMenuInstance) {
        typeaheadMenuInstance.remove();
      }
    }
  };

  //find the child node and relative position and set it on range
  const findingRange = (ind, nodes, position) => {
    if (nodes[ind].textContent.length >= position) {
      if (nodes[ind].childNodes.length > 0) {
        return findingRange(0, nodes[ind].childNodes, position);
      }
      const node =
        nodes[ind].nodeName === "#text" ? nodes[ind] : nodes[ind].firstChild;
      return { node, offset: position };
    }
    return findingRange(
      ind + 1,
      nodes,
      position - nodes[ind].textContent.length
    );
  };

  const updateInput = (input) => {
    const userInputBox = document.getElementById("listening-input-change");
    if (userInputBox) {
      const currentText = userInputBox.innerHTML;
      const position = cursorPosition;
      const everythingBeforeCursor = currentText
        .substring(0, position)
        .replace(/<[^>]+>/g, " ");
      const insertAutocompleted = everythingBeforeCursor.split(" ");
      const lastWord = insertAutocompleted.pop();
      const newText =
        currentText.substring(0, position - lastWord.length) +
        input +
        currentText.substring(position);

      userInputBox.innerHTML = newText;

      const range = document.createRange(); //Create a range (a range is a like the selection but invisible)
      const sel = window.getSelection(); //get the selection object (allows you to change selection)

      const startingNode = findingRange(
        0,
        userInputBox.childNodes,
        currentText.substring(0, position).replace(/<[^>]+>/g, "").length +
          input.length -
          lastWord.length
      );
      range.setStart(startingNode.node, startingNode.offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      userInputBox.focus();

      // remove the menu
      const typeaheadMenuInstance = document.getElementById("typeahead-menu");
      if (typeaheadMenuInstance) {
        typeaheadMenuInstance.remove();
      }
    }
  };

  return (
    <div>
      <div className="example-container">
        <div className="title">
          Here's an example of the input area a user sees, a typeahead menu will
          fetch data and attempt autocomplete:
        </div>
        <div
          contentEditable="true"
          translate="no"
          className="ChatInput"
          tabIndex="{0}"
        ></div>
      </div>
    </div>
  );
}
