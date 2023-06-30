var mongoOperators = {
    // @formatter:off
    equal:            function(v, f) { return  { "==" : [{"var":f}, v[0] ] } },
not_equal:        function(v, f) { return  { "!=" : [{"var":f}, v[0] ] } },
in:               function(v, f) { return  { "in" : [{"var":f}, v[0] ] } },
not_in:           function(v, f) { return  { "in" : [{"var":f}, v[0] ] } },
less:             function(v, f) { return  { "<" : [{"var":f}, v[0] ] } },
less_or_equal:    function(v, f) { return  { "<=" : [{"var":f}, v[0] ] } },
greater:          function(v, f) { return  { ">" : [{"var":f}, v[0] ] } },
greater_or_equal: function(v, f) { return  { ">=" : [{"var":f}, v[0] ] } },
// between:          function(v, f) { return { '$gte': v[0], '$lte': v[1] }; },
// not_between:      function(v, f) { return { '$lt': v[0], '$gt': v[1] }; },
// begins_with:      function(v, f) { return { '$regex': '^' + Utils.escapeRegExp(v[0]) }; },
// not_begins_with:  function(v, f) { return { '$regex': '^(?!' + Utils.escapeRegExp(v[0]) + ')' }; },
// contains:         function(v, f) { return { '$regex': Utils.escapeRegExp(v[0]) }; },
// not_contains:     function(v, f) { return { '$regex': '^((?!' + Utils.escapeRegExp(v[0]) + ').)*$', '$options': 's' }; },
// ends_with:        function(v, f) { return { '$regex': Utils.escapeRegExp(v[0]) + '$' }; },
// not_ends_with:    function(v, f) { return { '$regex': '(?<!' + Utils.escapeRegExp(v[0]) + ')$' }; },
// is_empty:         function(v, f) { return ''; },
// is_not_empty:     function(v, f) { return { '$ne': '' }; },
// is_null:          function(v, f) { return null; },
// is_not_null:      function(v, f) { return { '$ne': null }; }
// @formatter:on
}
export const getJsonLogic = (qb, data) =>{
    data = (data === undefined) ? qb.getRules() : data;

    if (!data) {
        return null;
    }

    var self = qb;

    return (function parse(group) {
        if (!group.condition) {
            group.condition = self.settings.default_condition;
        }


        if (!group.rules) {
            return {};
        }

        var parts = [];

        group.rules.forEach(function(rule) {
            if (rule.rules && rule.rules.length > 0) {
                parts.push(parse(rule));
            }
            else {
                var mdb = mongoOperators[rule.operator];
                var ope = self.getOperatorByType(rule.operator);



                if (ope.nb_inputs !== 0) {
                    if (!(rule.value instanceof Array)) {
                        rule.value = [rule.value];
                    }
                }

                /**
                 * Modifies the MongoDB field used by a rule
                 * @event changer:getMongoDBField
                 * @memberof module:plugins.MongoDbSupport
                 * @param {string} field
                 * @param {Rule} rule
                 * @returns {string}
                 */
                var field = self.change('getMongoDBField', rule.field, rule);

                // var ruleExpression = {};
                var ruleExpression = [];
                ruleExpression.push(mdb.call(self, rule.value, field));

                /**
                 * Modifies the MongoDB expression generated for a rul
                 * @event changer:ruleToMongo
                 * @memberof module:plugins.MongoDbSupport
                 * @param {object} expression
                 * @param {Rule} rule
                 * @param {*} value
                 * @param {function} valueWrapper - function that takes the value and adds the operator
                 * @returns {object}
                 */
                parts.push(self.change('ruleToMongo', ruleExpression[0], rule, rule.value, mdb));
            }
        });

        var groupExpression = {};
        groupExpression['' + group.condition.toLowerCase()] = parts;

        /**
         * Modifies the MongoDB expression generated for a group
         * @event changer:groupToMongo
         * @memberof module:plugins.MongoDbSupport
         * @param {object} expression
         * @param {Group} group
         * @returns {object}
         */
        return self.change('groupToMongo', groupExpression, group);
    }(data));
}
