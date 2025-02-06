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
    watch:{
        cards:{
            deep: true,
            handler(cards){
                cards.forEach(card => {
                    const completed = card.items.filter(i => i.completed).length
                    const total = card.item.length
                    const progress = completed / total

                    if (card.column === 1 && progress > 0.5){
                        if(this.secondColumnCards.length < 5){
                            card.column = 2
                        }
                    } else if ( card.column === 2 && progress === 1) {
                        card.column = 3
                        if(!card.completedDate){
                            card.completedDate = new Date().toLocaleString()
                        }
                    }
                })
                this.saveCard()
            }
        }
    }
})