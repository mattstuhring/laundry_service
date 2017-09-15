import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import {Panel} from 'react-bootstrap';
import { Link } from 'react-router';
import $ from 'jQuery';



export class Faq extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    $(document).ready(function() {
    	// Show or hide the sticky footer button
    	$(window).scroll(function() {
    		if ($(this).scrollTop() > 200) {
    			$('.go-top').fadeIn(200);
    		} else {
    			$('.go-top').fadeOut(200);
    		}
    	});

    	// Animate the scroll to top
    	$('.go-top').click(function(event) {
    		event.preventDefault();

    		$('html, body').animate({scrollTop: 0}, 300);
    	})
    });


    $(document).ready(function() {

      $(".faq li a").click(function(event) {
        event.preventDefault();

        $('.faq p').css({color: '#333'});

        $('html, body').animate({
          scrollTop: $( $(this).attr('href') ).offset().top
        }, 500);

        $( '.faq ' + $(this).attr('href') + ' p:first' ).css({color: '#337ab7'});
      });
    });
  }

  render() {

    return (
      <div className="container faq">
        <div className="row">
          <div className="col-sm-12">
            <Panel header="Frequently Asked Questions" bsStyle="primary">
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1">
                  <h4><strong>List of Questions:</strong></h4>
                  <ul>
                    <li><a href="#one"><em>Question #1</em></a></li>
                    <li><a href="#two"><em>Question #2</em></a></li>
                    <li><a href="#three"><em>Question #3</em></a></li>
                    <li><a href="#four"><em>Question #4</em></a></li>
                    <li><a href="#five"><em>Question #5</em></a></li>
                  </ul>
                </div>
              </div>

              <div className="row answers">
                <div className="col-sm-10 col-sm-offset-1">

                  <hr/>

                  <section id="one">
                    <p><strong>Question #1</strong></p>
                    <p>Bacon ipsum dolor amet rump cow turducken filet mignon ham hock frankfurter shankle, tenderloin pastrami cupim bacon andouille capicola boudin. Chuck frankfurter sirloin, fatback brisket spare ribs shoulder ham hock burgdoggen pancetta pork belly flank. Frankfurter pancetta capicola shank flank chuck. Beef rump turkey porchetta ball tip landjaeger bacon meatloaf hamburger pork chop shankle salami fatback. Meatloaf drumstick boudin landjaeger, ribeye spare ribs tail beef ribs ball tip ground round flank. Pancetta beef ribs bacon strip steak shankle.</p>
                  </section>

                  <hr/>

                  <section id="two">
                    <p><strong>Question #2</strong></p>
                    <p>Drumstick fatback capicola kevin flank pork sirloin tongue spare ribs andouille. Tail venison hamburger, doner cupim shankle drumstick porchetta jerky fatback tenderloin tri-tip picanha biltong cow. Tail alcatra tri-tip burgdoggen spare ribs kielbasa porchetta salami shoulder shank tenderloin hamburger turkey short loin pork loin. Kevin meatloaf cow bacon. Ground round cow kielbasa, pork loin turkey sirloin landjaeger ham hock short ribs jowl tail meatball. Short ribs corned beef tenderloin biltong picanha short loin landjaeger filet mignon turkey rump pancetta.</p>
                  </section>

                  <hr/>

                  <section id="three">
                    <p><strong>Question #3</strong></p>
                    <p>Pastrami pork picanha drumstick. Strip steak pork loin pig, ham hock salami turkey jowl beef ribs bresaola meatloaf ground round kevin. Pork loin frankfurter pork chop corned beef, pastrami chuck short ribs jerky. Spare ribs kielbasa bresaola shoulder flank sausage ball tip tongue landjaeger short ribs pancetta. Tri-tip bresaola shoulder kevin tail, short ribs beef salami. Chicken short ribs shoulder biltong, jerky burgdoggen ribeye pork belly venison porchetta rump flank doner turkey.</p>
                  </section>

                  <hr/>

                  <section id="four">
                    <p><strong>Question #4</strong></p>
                    <p>Shank ham beef ribs capicola chuck bacon sausage t-bone corned beef strip steak. Pork belly pork biltong pork chop pastrami chicken. Venison turkey sausage chuck prosciutto filet mignon biltong corned beef jowl spare ribs rump frankfurter. Short ribs capicola meatloaf fatback pig shank tail pork tongue beef ribs pancetta hamburger venison. Swine pancetta tongue meatloaf, brisket pig shankle pork chop filet mignon sirloin tenderloin drumstick t-bone alcatra capicola. Bacon chuck frankfurter, drumstick prosciutto pork loin boudin burgdoggen. Turkey fatback meatball tri-tip tongue chuck short ribs hamburger pancetta strip steak drumstick cow jerky ball tip.</p>
                  </section>

                  <hr/>

                  <section id="five">
                    <p><strong>Question #5</strong></p>
                    <p>Porchetta frankfurter cupim, jowl pig pork chop tri-tip kielbasa beef. Salami doner shoulder, leberkas bresaola ham strip steak drumstick sausage pork belly cow. Burgdoggen meatball chicken turducken ribeye cow. Brisket burgdoggen andouille, fatback pancetta picanha chuck leberkas spare ribs landjaeger drumstick turkey jowl tongue. Pancetta spare ribs salami jowl chicken. Andouille brisket picanha capicola chuck t-bone. Tri-tip biltong fatback meatloaf kevin chuck, frankfurter short ribs.</p>
                  </section>
                </div>
              </div>
            </Panel>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 text-right">
            <a href="#" className="go-top">Back to top!</a>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Faq);
