let input = document.querySelector('.input');
let suggestionsList = document.querySelector('ul.suggestions');

let debouncedGetRepositories = debounce(getRepositories, 500);

input.addEventListener('input', () => debouncedGetRepositories(input.value));

async function getRepositories(inputSearchQuery = '') {
  const REPOSITORIES_PER_PAGE = 5;
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${inputSearchQuery}&page=1&per_page=${REPOSITORIES_PER_PAGE}`,
  );
  const data = await response.json();

  console.log(data);

  suggestionsList.innerHTML = '';

  console.log(data.items.slice(0, REPOSITORIES_PER_PAGE));
  data.items.slice(0, 5).forEach((item) => {
    console.log(item);
    let li = document.createElement('li');

    li.textContent = item.name;
    suggestionsList.appendChild(li);
  });
}

function debounce(fn, debounceTime) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, arguments), debounceTime);
    console.log(timer);
    console.log('timer');
  };
}
