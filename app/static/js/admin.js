allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li p');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', () => {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

// TOGGLE SIDEBAR
menuBar = document.getElementById('menu-bar');
sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', () => {
    sidebar.classList.toggle('hide');
})

searchButton = document.getElementById('search-btn');
searchButtonIcon = document.getElementById('search-button-icon');
searchForm = document.getElementById('search-form');

searchButton.addEventListener('click', e => {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if(searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
})

if (window.innerWidth < 768) {
    sidebar.classList.add('hide');
} 
else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
}

window.addEventListener('resize', () => {
    if(this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
})