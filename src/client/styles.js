const styles = {
  base: {
    height: '100%',
  },
  agenda:{
    base:{
      marginTop: '15px',
      marginBottom: '15px',
    },
    month:{
    },
    day:{
      borderWidth:  "1px",
      borderStyle:  "solid",
      borderColor:  "#68696C",
      backgroundColor: "#434857" ,
      minHeight: '75px',
    },
    selectedDay:{
      backgroundColor: "#637D93",
    },
    weekday:{
      marginBottom: '2px'
    },
    dayOfMonth:{
      fontSize: '0.9em',
      margin: '5px',
    },
    weekNumber:{
      fontSize: '0.9em',
      padding: '.2rem',
      margin: '1px',
      color: '#cfd2da',
      backgroundColor: '#0275d8',
      display: 'inline-block',
      textAlign: 'center',
      verticalAlign: 'baseline',
      borderRadius: '.25rem',
    },
    dayOfMonthOutBound:{
      color: 'grey',
    }
  }
}

export default styles;
