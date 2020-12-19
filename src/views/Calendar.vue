
<template>
  <div class="demo-app">
    <FullCalendar
      class="demo-app-calendar"
      ref="fullCalendar"
      defaultView="dayGridMonth"
      :customButtons="{
         myCustomButton: {
          text: 'Check custom button prop!',
          click: function() {
            alert('clicked the custom button!');
          }
        }
      }"
      :header="{
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }"
      :editable='true'
      :plugins="calendarPlugins"
      :weekends="calendarWeekends"
      :events="calendarEvents"
      eventLimit="{eventLimit: true}"
      @dateClick="handleDateClick"
      @eventClick="eventClicked"
      @eventDragStart="dragStart"
      @eventDrop ="dragDrop"
      @eventResize="resizeEnd"
    />
    <b-modal :active.sync="isComponentModalActive" :canCancel="false" has-modal-card>
      <modal-form @close="isComponentModalActive = false" @save="eventCreate" :arg="argToCreate" :mode="purpose" @remove="removeEvent"></modal-form>
    </b-modal>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalForm from "./CreateModal";
import uuid from 'uuid/v4';
// import _ from 'lodash';
// import buefy from 'buefy';
export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    ModalForm
  },
  // mixins: [Mixin],
  data() {
    return {
      calendar: {},
      isComponentModalActive: false,
      purpose: 'Add',
      isMobile: false,
      argToCreate: {},
      calendarPlugins: [
        // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: []
    };
  },
  methods: {
    async pushToStore() {
      await this.$nextTick();
      const tEvents = this.calendar.getEvents();
      const arrToCommit = [];
      for(const event of tEvents){
        const objToCommit = {
          title: event.title,
          start: event.start,
          end: event.end,
          color: event.backgroundColor,
          id: event.id,
          textColor: event.textColor,
          borderColor: event.borderColor,
          desc: event.extendedProps.desc
        }
        arrToCommit.push(objToCommit)
      }
      this.$store.commit('events', arrToCommit);
    },
    removeEvent(id){
      let eventToRemove = this.calendar.getEventById( id )
      eventToRemove.remove()
      this.pushToStore();
    },
    async eventCreate(infoObj) {
      if(this.purpose === 'Edit') { 
      let totatEvent = [];
      totatEvent.push(this.calendar.getEvents());
        totatEvent[0].forEach(element => {
          if(element.id === infoObj.id){
            let eventToEdit = this.calendar.getEventById( infoObj.id )
            eventToEdit.setProp('end', infoObj.end)
            eventToEdit.setProp('title', infoObj.title)
            eventToEdit.setProp('backgroundColor', infoObj.color || infoObj.backgroundColor)
            eventToEdit.setExtendedProp('desc', infoObj.extendedProps.desc)
          }
        });
      }
      else this.calendarEvents.push(infoObj);
      this.pushToStore();
    },
    toggleWeekends() {
      this.calendarWeekends = !this.calendarWeekends; // update a property
    },
    gotoPast() {
      const calendarApi = this.$refs.fullCalendar.getApi(); // from the ref="..."
      calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
    },
    handleDateClick(arg) {
      this.purpose = 'Add';
      this.argToCreate = arg;
      this.isComponentModalActive = true;
    },
    eventClicked(ev) {
      this.purpose = 'Edit';
      this.argToCreate = ev
      this.isComponentModalActive = true;
    },
    dragStart(ev){
      console.log('Drag STARTED!!', ev)
    },
    dragDrop(ev){
      console.log('Drag Stopped!!', ev)
      this.pushToStore();
    },
    resizeEnd(ev) {
      this.purpose = 'Edit'
      this.eventCreate(ev.event)
      this.pushToStore();
    }
  },
  async created() {
    if(navigator.maxTouchPoints > 1) this.isMobile = true
    await this.$nextTick();
    this.calendar = this.$refs.fullCalendar.getApi();
    // // calendar.setOption('contentHeight', 600);
    this.calendar.setOption("height", 1300);
    // // calendar.setOption('width', 100);
    // // calendar.setOption('aspectRatio', 1.1);
    // var ratio = calendar.getOption('aspectRatio');
    const existingEvents = this.$store.state.events;
    if(existingEvents.length){
      for (let i = 0; i < existingEvents.length; i++) {
        existingEvents[i].allDay= true,
        this.calendar.addEvent(existingEvents[i]);
      } 
    }
  }
};
</script>

<style lang='scss'>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";
@import "~bulma/bulma";
@import "~buefy/dist/buefy.css";

.demo-app {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}
.fc-button {
  text-transform: capitalize;
  font-size: 1.2rem;
}

.demo-app-top {
  margin: 0 0 3em;
}

.demo-app-calendar {
  margin: 0 auto;
}
.fc-content {
  height: 30px;
}
.fc-title {
  font-size: 22px;
  text-decoration: underline;
}
.fc-day-number {
  font-size: 20px;
}
.fc-event-container {
  padding: 2px !important;
}
.fc-event {
  height: 40px;
}
.fc-popover, .fc-more-popover {
  width: 20%
}
.fc-title {
  padding: 1px 10px 0px;
}
.save {
  position: absolute;
  right: 20%;
  top: 4%;
}
  @media only screen and (min-device-width: 480px) 
                     and (max-device-width: 640px) 
                     and (orientation: landscape) {
   .save {
    top: -10px;
  }
  }
</style>
