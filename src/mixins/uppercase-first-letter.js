export default {
  methods: {
    upperCaseFirstLetter(str) {
      return str.replace(/^./, str[0].toUpperCase())
    }
  }
}
