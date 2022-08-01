<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon :class="[ recordIconColor(record.amount), 'lighten-1 white--text' ]">{{ recordIcon(record.amount) }}</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ record.description }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ record.category.description }} | {{ record.account.description }}
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <span :class="amountColor(record.amount)">{{ formatCurrency(record.amount) }}</span>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import amountColorMixin from './../mixins/amount-color'
import formatCurrencyMixin from '@/mixins/format-currency'

export default {
  name: 'RecordsListItem',
  mixins: [amountColorMixin, formatCurrencyMixin],
  props: {
    record: {
      type: Object
    }
  },
  methods: {
    recordIcon(amount) {
      return amount > 0 ? 'arrow_upward' : 'arrow_downward'
    },
    recordIconColor(amount) {
      return amount > 0 ? 'primary' : 'danger'
    }
  }
}
</script>
