Vue.component('card-component', {
    props: ['card', 'editable'],
    computed: {
        progress () {
            const completed = this.card.items.filter(i => i.completed).length
            return (completed / this.card.items.length) * 100
        }
    },
    template: `
    <div class ="card">
    <h3>{{ card.title }}</h3>
    <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%'}"></div>
    </div>
    <ul>
        <li v-for="(item, index) in card.items" :key="index">
            <label>
                <input type="checkbox" v-model="item.complated" :disable="!editable || card.column === 3">
                <span : style"{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#95a5a6' : '#2c3e50'}">
            {{ item.text }}
                </span>
            </label>
        </li>
    </ul>
    <div v-if ="card.completedDate" class="completed-date">
    Complete: {{ card.completedDate }} 
    </div>
</div>
    `
})

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
    },
    method: {
        addItem(){
            if(this.newCardItems.length < 5){
                this.newCardItems.push('')
            }
        },
        removeItem(){
            if(this.new.CardItems.length > 3){
                this.newCardItems.pop()
            }
        },
        createCard(){
            if(!this.newCardTitle.trim() || this.newCardItems.some(i => !i.trim())){
                alert('PLease fill all fields')
                    return
            }

            this.cards.push({
                id: Date.now(),
                title: this.newCardTitle,
                items: this.newCardItems.map(text => ({text, completed: false})),
                column: 1,
                completedDate: null
            })

            this.newCardTitle = ''
            this.newCardItems = ['', '', '']
        },
        saveCards(){
            localStorage.setItem('cards',JSON.stringify(this.cards))
        },
        loadCards(){
            const savedCards = localStorage.getItem('cards')
            if(savedCards) {
                this.cards = JSON.parse(savedCards)
            }
        }
    }
})