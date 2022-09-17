// fetch('https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc')
//   .then((res) => res.json())
//   .then((data) => console.log(data.items));

// fetch('https://api.github.com/search/repositories?q=calculator')
//   .then((res) => res.json())
//   .then((data) => console.log(data.items));

// fetch('https://api.github.com/search/repositories?q=calculator&page=1&per_page=100')
//   .then((res) => res.json())
//   .then((data) => console.log(data));

document.querySelector('.input').addEventListener('input', (e) => {
  // console.log(e.currentTarget.value);
  const debouncedGetRepositories = debounce(getRepositories, 500);
  // const debounced = debounce(getRepositories, 500);

  debouncedGetRepositories(e.currentTarget.value);
  // debounced();
});

async function getRepositories(inputValue) {
  let response = await fetch(
    `https://api.github.com/search/repositories?q=${inputValue}&page=1&per_page=100`,
  );
  let data = await response.json();

  console.log(data);
}

function debounce(func, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall;

    this.lastCall = Date.now();

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }

    this.lastCallTimer = setTimeout(() => func(...args), timeoutMs);
  };
}
