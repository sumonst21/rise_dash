import { createSelector } from 'reselect'

const selectData = (state) => {
    return state.unfilteredData
};

const selectDateFilter = (state) => {
    if (state.dateFilter === 'no_filter') {
        return ''
    } else {
        return state.dateFilter
    }
};

const selectConsultantFilter = (state) => {
    if (state.consultantFilter === 'no_filter') {
        return ''
    } else {
        return state.consultantFilter
    }
};

const selectGenericFilters = (state) => {
    return Object.assign({}, state.genericFilters)
};

export const selectFilteredData = createSelector(
    [selectData,
    selectDateFilter,
    selectConsultantFilter,
    selectGenericFilters],
    (data, dateFilter, consultantFilter, selectGenericFilters) => {
        const filter = {date_of_session: dateFilter, consultant_name: consultantFilter};

        Object.assign(filter, selectGenericFilters);

        return data.filter((item) => {
            for (let key in filter) {
                if (filter[key] === 'no_filter') {
                    return true;
                }
                else if (filter[key] && (item[key] === undefined || item[key] !== filter[key])) {
                    return false;
                }
            }
            return true;
        })
    }
);