const {
  hostId = 1,
  closeWidth = 48,
  closeHeight = 48,
  openWidth = 380,
  openHeight = 680
} = document.currentScript.dataset;
const _src = document.currentScript.src;
const wrapper = document.createElement("iframe");
const styles = {
  position: "fixed",
  borderRadius: "8px",
  right: "16px",
  bottom: "16px",
  border: "none",
  zIndex: 9999,
  boxShadow: `rgb(0 0 0 / 25%) 0px 25px 50px -12px`
};
Object.assign(wrapper.style, styles);
wrapper.src = `${new URL(_src).origin}/widget.html?host=${hostId}`;
wrapper.width = closeWidth;
wrapper.height = closeHeight;
wrapper.frameborder = 0;
window.addEventListener(
  "message",
  (event) => {
    const { data: CMD } = event;
    switch (CMD) {
      case "OPEN":
        wrapper.setAttribute("width", openWidth);
        wrapper.setAttribute("height", openHeight);
        break;
      case "CLOSE":
        wrapper.setAttribute("width", closeWidth);
        wrapper.setAttribute("height", closeHeight);
        break;
      case "RELOAD_WITH_OPEN":
        {
          const url = new URL(wrapper.src);
          url.searchParams.append("open", new Date().getTime());
          console.log("new src", url.href);
          wrapper.src = url.href;
        }
        break;
      default:
        break;
    }
  },
  false
);
document.body.appendChild(wrapper);
