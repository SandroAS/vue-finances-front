<template>
  <v-toolbar :color="color">
    <v-layout align-center>

      <v-flex xs1>
        <div class="text-xs-left">
          <v-btn icon @click="decrement">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs10>
        <v-toolbar-title class="text-xs-center">
          <span>{{ upperCaseFirstLetter(currentMonth) }}</span>
        </v-toolbar-title>
      </v-flex>

      <v-flex xs1>
        <div class="text-xs-right">
          <v-btn icon @click="increment">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </div>
      </v-flex>

    </v-layout>
  </v-toolbar>
</template>

<script>
import moment from 'moment'
import upperCaseFirstLetter from '@/mixins/uppercase-first-letter'

export default {
  name: 'ToolbarByMonth',
  mixins: [upperCaseFirstLetter],
  props: {
    color: {
      required: true,
      type: String,
      default: 'primary'
    },
    format: {
      required: true,
      type: String,
      default: 'MM-YYYY'
    },
    month: {
      required: true,
      type: String,
      default: ''
    }
  },
  data: () => ({
    date: undefined
  }),
  computed: {
    currentMonth() {
      return this.date.format('MMMM YYYY')
    }
  },
  created() {
    this.setCurrentMonth()
    this.emit()
  },
  methods: {
    emit() {
      this.$emit('month', this.date.format(this.format))
    },
    decrement() {
      this.date = this.date.clone().subtract(1, 'month')
      this.emit()
    },
    increment() {
      this.date = this.date.clone().add(1, 'month')
      this.emit()
    },
    setCurrentMonth() {
      this.date = this.month ? moment(this.month, this.format) : moment()
    }
  }
}
</script>
