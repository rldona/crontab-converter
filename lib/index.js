var utils = require('./utils');

module.exports = function(options) {

    var internals = {};

    internals.convert = function() {

        return new Promise(function(resolve, reject) {

            var MONTH_LABELS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
            var WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

            var jobCrontabs = {
                "from": null,
                "to": null,
                "cronjobs":[]
            };

            if (!options) {
                return 'Seleccionar fechas';
            }

            //            seg  min  hor  dia  mes dsemana
            var result = ['0', '0', '*', '*', '*', '*'];

            if (options.from) {
                var datefrom = new Date(options.from);

                jobCrontabs.from = {
                    "cron" : ['0', '0', '0', datefrom.getDate(), datefrom.getMonth()+1, '*'].join(' '),
                    "year" : datefrom.getFullYear()
                };
            }

            if (options.to) {
                var dateto = new Date(options.to);

                // Sumo un día a la fecha de fin, para incluir el dia del hasta en la ejecución.
                dateto.setDate(dateto.getDate() + 1);

                jobCrontabs.to = {"cron" : ['0', '0', '0', dateto.getDate(), dateto.getMonth(), '*'].join(' '),
                                "year" : dateto.getFullYear()}
            }

            if (options.time.interval && options.time.interval !== 60) {
                result[1] = '*/' + options.time.interval;
            }

            if (options.time.range.length && options.time.range[0].from !== null && options.time.range[0].to !== null) {
                var ranges = [];
                for(var i = 0; i < options.time.range.length; i++) {
                    var range = options.time.range[i];
                    var from = new Date(range.from).getHours();
                    var to = new Date(range.to).getHours();
                    ranges.push(from + '-' + to);
                }
                result[2] = ranges.join(',');
            }

            var months = options.months.map(function(item, index) {
                return {
                    index: index,
                    label: MONTH_LABELS[index],
                    value: item
                };
            }).filter((item) => {
                return item.value;
            }).map((item) => {
                return item.index;
            }).join(',');

            if (months.length) {
                result[4] = months;
            }

            var weekdays = options.weekdays.map(function(item, index) {
                return {
                    index: index,
                    label: WEEKDAY_LABELS[index],
                    value: item
                };
            }).filter((item) => {
                return item.value;
            }).map((item) => {
                return (item.index+1)%7;
            }).join(',');

            if (weekdays.length) {
                result[5] = weekdays;
            }

            if (options.time.exact.length) {
                for (var i = 0; i < options.time.exact.length; i++) {
                    result[1] = new Date(options.time.exact[i]).getMinutes();
                    result[2] = new Date(options.time.exact[i]).getHours();
                    result[0] = utils.getRandomInt(0,60);

                    // Meto el cron en el array de cronjobs
                    jobCrontabs.cronjobs.push(result.join(' '));
                }

            } else {
                result[0] = utils.getRandomInt(0,60);
                jobCrontabs.cronjobs.push(result.join(' '));
            }

            resolve(jobCrontabs);

        });

    }

    return internals;

}
