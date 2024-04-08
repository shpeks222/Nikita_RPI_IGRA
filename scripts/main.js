const sliderValue = document.querySelectorAll("span");
const inputSlider = document.querySelector("input");

const changeSize = () => {
    const value = inputSlider.value;
    sliderValue[0].textContent = value;
    sliderValue[1].textContent = value;
}

const setSize = () => {
    localStorage.clear();
    localStorage.setItem("size", inputSlider.value);
    inputSlider.value = "6";
    sliderValue[0].textContent = "6";
    sliderValue[1].textContent = "6";
}