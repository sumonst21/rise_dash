import { createSelector } from 'reselect'

const selectData = (state) => {
    return state.filters.form
};

const selectDateFilter = (state) => {
    if (state.filters.dateFilter === 'no_filter') {
        return ''
    } else {
        return state.filters.dateFilter
    }
};

const selectConsultantFilter = (state) => {
    if (state.filters.consultantFilter === 'no_filter') {
        return ''
    } else {
        return state.filters.consultantFilter
    }
};

export const selectFilteredData = createSelector(
    selectData,
    selectDateFilter,
    selectConsultantFilter,
    (data, dateFilter, consultantFilter) => {
        const filter = {date_of_session: dateFilter, your_peer_learning_group: consultantFilter};

        return data.filter((item) => {
            for (let key in filter) {
                if (filter[key] && (item[key] === undefined || item[key] !== filter[key])) {
                    return false;
                }
            }
            return true;
        })
    }
);