let input = document.querySelector('.search-repositories__input');
let suggestionsList = document.querySelector('ul.suggestions-list');
let repositoriesList = document.querySelector('ul.repositories-list');

let debouncedGetRepositories = debounce(getRepositories, 500);

input.addEventListener('input', () => debouncedGetRepositories(input.value));

async function getRepositories(inputSearchQuery = '') {
  const REPOSITORIES_PER_PAGE = 5;
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${inputSearchQuery}&page=1&per_page=${REPOSITORIES_PER_PAGE}`,
  );
  const data = await response.json();

  renderSuggestions(data.items.slice(0, REPOSITORIES_PER_PAGE));
}

function debounce(fn, debounceTime) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, arguments), debounceTime);
  };
}

function renderSuggestions(repositoriesDataList) {
  console.log('repositoriesDataList', repositoriesDataList);

  suggestionsList.innerHTML = '';

  if (repositoriesDataList.length === 0) {
    suggestionsList.innerHTML = '<li>По вашему запросу не было ничего найдено</li >';
    return;
  }
  repositoriesDataList.forEach((item) => {
    console.log(item);
    let li = document.createElement('li');

    li.textContent = item.name;
    li.setAttribute('data-id', item.id);

    li.addEventListener('click', (e) => {
      console.log(e.currentTarget);
      suggestionsList.innerHTML = '';
      input.value = '';

      appendRepositoryToList(item.name, item.owner.login, item.stargazers_count);
    });

    li.classList.add('suggestions-list__item');

    suggestionsList.appendChild(li);
  });
}

repositoriesList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    console.log('button');
    e.target.closest('li').remove();
  }
});

function appendRepositoryToList(name, owner, stars) {
  console.log('data', name, owner, stars);

  const li = document.createElement('li');
  const div = document.createElement('div');
  const deleteButton = document.createElement('button');

  div.innerHTML = `<p class="repositories-list__paragraph">${name}</p><p class="repositories-list__paragraph">${owner}</p><p class="repositories-list__paragraph">${stars}</p>`;
  deleteButton.textContent = '×';

  deleteButton.classList.add('repositories-list__delete-button');

  li.appendChild(div);
  li.appendChild(deleteButton);

  li.classList.add('repositories-list__item');

  repositoriesList.appendChild(li);
}
