import './index.scss'
import { Tag } from 'primereact/tag'
import Moksh from '../../../assets/img/mokshPotrait.jpg'

/*
 DashBoardContact Component
 This component displays the SkillBridge team members, their roles,
 skills, and contact details. It includes portraits, descriptions,
 and tags representing technical expertise.
*/
export default function DashBoardContact() {
  return (
    <div className="DashBoard-ContactWrapper-Primary">
      <div className="contact-introHeader-wrap">
        <div className="span-3">
          <h1>Meet the Developer</h1>
        </div>
      </div>
      <div className="contact-AboutCard-wrapper">
        <div>
          <img src={Moksh} />
        </div>
        <div className="contact-CardText-wrap">
          <h1>Moksh Somayajula</h1>
          <h2>Web Developer</h2>
          <p>
            Moksh Somayajula is the Web Developer at SkillBridge, where he
            brings ideas to life through intuitive, user-centered design. With a
            strong focus on creating seamless and engaging user experiences,
            Moksh is responsible for shaping the visual identity and interface
            of the platform.
          </p>
          <div className="pad-bottom-10 contact-skills span-2">
            <div className="contact-tags">
              <Tag className="tag" value="React" />
              <Tag className="tag" value="Node.js" />
              <Tag className="tag" value="Express" />
              <Tag className="tag" value="MongoDB" />
              <Tag className="tag" value="MySQL" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}