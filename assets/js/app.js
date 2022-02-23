let gamesListURL = "https://www.palmsbet.com/static/games_bg.json";
let gamesListFilter = [];
let gameList = document.getElementById("gameList");
let startList = 0;
let maxPerLoad = 5;
let endOfTheList = 0;
let ticking = false;
let myLoader = document.getElementById("myLoader");
let allLoaded = false;
let playTitle = "Играй";
let demoTitle = "Демо";

function getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset
    };
}

function showOtherItems() {
    let visibleDistance = 300;
    if (myLoader) {
        if ((window.pageYOffset + window.innerHeight + visibleDistance) > getOffset(myLoader).top) {
            if (!allLoaded) {                        
                printHTML();
            }
        }
    }
}


window.addEventListener('scroll', function (e) {
    if (!ticking) {
        window.requestAnimationFrame(function () {
            showOtherItems();
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('resize', function (e) {
    showOtherItems();
});

function printHTML() {

    let allItemsCont = Object.keys(gamesListFilter).length;
    endOfTheList += maxPerLoad;

    if (endOfTheList > allItemsCont) {
        endOfTheList = allItemsCont;
        allLoaded = true;
    }

    for (startList; startList < endOfTheList; startList++) {
        let item = document.createElement("LI");
        item.innerHTML = '<a href="' + gamesListFilter[startList][1].launch_url + '"><figure style="background-image:url(' + gamesListFilter[startList][1].img_url + ');"></figure></a><div class="gameInfo"><span>' + gamesListFilter[startList][1].name + '</span></div><div class="gamePlay"><a href="' + gamesListFilter[startList][1].demo_launch_url + '">' + demoTitle + '</a><a href="' + gamesListFilter[startList][1].launch_url + '">' + playTitle + '</a></div>';
        let att = document.createAttribute("data-id");
        att.value = gamesListFilter[startList][0];
        item.classList.add("volatility_" + gamesListFilter[startList][1].volatility);
        item.setAttributeNode(att);
        gameList.appendChild(item);
    }

    if (!allLoaded) {
        setTimeout(() => {showOtherItems()}, 300);        
    }
}

function sortData(data) {
    let obj = data.game_list;
    Object.keys(obj).forEach(function (key, value) {
        if (key, obj[key].vendor_code === "CTRGSECASINO") {
            gamesListFilter.push([key, obj[key]]);
        }
    });
    printHTML();
}

fetchGamesList((error, data) => {
    if (error)
    console.log(error);
    //show loading
    //retry after 10 s max 3~5 times
    //if still error show OPS something is wrong !
    else
        sortData(data);
});

function fetchGamesList(callback) {
    fetch(gamesListURL)
        .then(response => response.json())
        .then(json => callback(null, json))
        .catch(error => callback(error, null))
}