const input = document.querySelector('.search-repositories__input');
const suggestionsList = document.querySelector('ul.suggestions-list');
const repositoriesList = document.querySelector('ul.repositories-list');

const debouncedGetRepositories = debounce(getRepositories, 500);

input.addEventListener('input', (e) => {
  if (e.currentTarget.value === '') {
    suggestionsList.innerHTML = '';
    return;
  }

  debouncedGetRepositories(e.currentTarget.value);
});

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
  suggestionsList.innerHTML = '';

  if (repositoriesDataList.length === 0) {
    suggestionsList.innerHTML = '<li>По вашему запросу не было ничего найдено</li >';
    return;
  }
  repositoriesDataList.forEach((item) => {
    let li = document.createElement('li');

    li.textContent = item.name;
    li.setAttribute('data-id', item.id);

    li.addEventListener('click', (e) => {
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
    e.target.closest('li').remove();
  }
});

function appendRepositoryToList(name, owner, stars) {
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
