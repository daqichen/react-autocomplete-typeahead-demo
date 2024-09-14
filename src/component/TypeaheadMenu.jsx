export const TypeaheadMenu = ({ menuItems, onClick }) => {
  return (
    <div>
      <div className="typeahead-menu">
        {menuItems.map((item, index) => (
          <div
            className="menu-item"
            id={"menu-item-" + index}
            data-value={item.label}
            onClick={onClick}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
