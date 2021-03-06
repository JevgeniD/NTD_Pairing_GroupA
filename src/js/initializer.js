var FixtureFinder = {
    currentLanguage : 'en',
    currentDateSelected : moment(),
    dateFormat : "YYYY-MM-DD"
};

FixtureFinder.initializer = function() {
    var dateSelectButtons = '.dateSelect';
    var teamFilterInput = $('.navbar .team-filter');
    var countryFilterSelector = '.competitions input[name=competition]';
    var localizeButtons = '.localize input[type="radio"]';

    var getFixturesByDate = function(date) {
        FixtureFinder.FixtureRetriever.getFixturesByDate(
            date || moment().format(FixtureFinder.dateFormat),
            fixtureFilter
        );
    };

    var getFixturesForCurrentDate = function() {
        getFixturesByDate(FixtureFinder.currentDateSelected.format(FixtureFinder.dateFormat));
    };

    var fixtureFilter = function(fixtures) {
        var filteredByCountry = FixtureFinder.filterCountries($(countryFilterSelector + ':checked')[0].id)(fixtures);
        var filteredByTeam = FixtureFinder.filterTeams(teamFilterInput[0].value)(filteredByCountry);
        return filteredByTeam;
    }

    var filterCurrentFixtureList = function(){
        return FixtureFinder.FixtureRetriever.filterCurrentWith(fixtureFilter);
    };

    var daysToMillis = function(days) {
        return days * 24 * 60 * 60 * 1000;
    };

    var addListenerFor = function(selector, listenerType, handler) {
        $(selector)[listenerType](handler);
    };

    var addListeners = function() {
        addListenerFor(teamFilterInput, 'keyup', filterCurrentFixtureList);
        addListenerFor(countryFilterSelector, 'click', filterCurrentFixtureList);
        addListenerFor(localizeButtons, 'click',
            function(){ FixtureFinder.localizePage(this.value) }
        );
        addListenerFor(dateSelectButtons, 'click',
            function() {
                var offset = this.getAttribute('data-offset');
                if (offset === "0") {
                    FixtureFinder.currentDateSelected = moment();
                } else {
                    FixtureFinder.currentDateSelected = moment(FixtureFinder.currentDateSelected).add(daysToMillis(parseInt(offset)));
                }
                getFixturesForCurrentDate();
            }
        );
    };

    return {
        init: function() {
            getFixturesForCurrentDate();
            addListeners();
        }
    }
}();
