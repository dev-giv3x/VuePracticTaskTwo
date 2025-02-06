new Vue({
    el: '#app',
    data(){
        return {
            card: [],
            newCardTitle: '',
            newCardItems: ['','','']
        }
    },
    created(){
        this.loadCrads();
    },
    computed: {
        firstColumnCards(){
            return this.cards.filter(card => card.column === 1).slice(0,3)
        },
        secondColumnCards(){
            return this.cards.filter(card => card.column === 2).slice(0,5)
        },
        thirdColumnCards(){
            return this.cards.filter(card => card.column === 3)
        },
        isSecondColumnFull(){
            return this.secondColumnCards.length >= 5
        },
        anyFirstColumnOver50(){
            return this.firstColumnCards.some(card => {
                const completed = card.items.filter(i =>i.completed).length
                return completed / card.items.length > 0.5
            })
        },
        isFirstColumnBlocked(){
            return this.isSecondColumnFull && this.anyFirstColumnOver50
        }
    },
})