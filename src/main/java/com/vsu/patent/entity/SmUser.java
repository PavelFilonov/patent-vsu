package com.vsu.patent.entity;

import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static com.vsu.patent.entity.enums.UserEditStep.USER_EDIT_PERSONAL;
import static java.lang.String.format;
import static javax.persistence.CascadeType.ALL;
import static javax.persistence.EnumType.STRING;
import static javax.persistence.FetchType.LAZY;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.entity.enums.UserEditStep;
import io.tesler.api.data.dictionary.LOV;
import io.tesler.model.core.entity.BaseEntity;
import io.tesler.model.core.entity.Department;
import io.tesler.model.core.entity.User;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.NotAudited;

@Entity
@Table(name = "USERS")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"userPrograms", "userInnovations"})
public class SmUser extends BaseEntity {

	private String firstName;

	private String lastName;

	private String patronymic;

	private String login;

	@JsonIgnore
	private String password;

	@Deprecated
	@Column(name = "internal_role_cd")
	private LOV internalRole;

	private String userPrincipalName;

	private String phone;

	private String email;

	private String fullUserName;

	private String title;

	@Column(name = "ext_attr_11")
	private String extensionAttribute11;

	@Column(name = "ext_attr_12")
	private String extensionAttribute12;

	@Column(name = "ext_attr_13")
	private String extensionAttribute13;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dept_id")
	private Department department;

	private String origDeptCode;

	private LOV timezone;

	private LOV locale;

	@Column(name = "ext_attr_14")
	private String extensionAttribute14;

	@Column(name = "ext_attr_15")
	private String extensionAttribute15;

	private String dn;

	private Boolean active;

	@NotAudited
	@OneToMany(fetch = LAZY, mappedBy = "user", cascade = ALL, orphanRemoval = true)
	private List<SmUserRole> userRoleList;

	@OneToMany(fetch = LAZY, mappedBy = "user", cascade = ALL, orphanRemoval = true)
	private List<UserProgram> userPrograms;

	@OneToMany(fetch = LAZY, mappedBy = "user", cascade = ALL, orphanRemoval = true)
	private List<UserInnovation> userInnovations;

	@Enumerated(value = STRING)
	private Status status = IN_THE_MAKING;

	@Enumerated(value = STRING)
	private UserEditStep editStep = USER_EDIT_PERSONAL;

	@Override
	public Long getId() {
		return super.getId();
	}

	public User toSimpleTeslerUser() {
		User result = new User();
		result.setId(this.getId());
		result.setLogin(this.getLogin());
		result.setCreatedBy(this.getCreatedBy());
		result.setLastUpdBy(this.getLastUpdBy());
		result.setActive(this.getActive());
		result.setLoadVstamp(this.getLoadVstamp());
		result.setCreatedDate(this.getCreatedDate());
		result.setUpdatedDate(this.getUpdatedDate());
		result.setVstamp(this.getVstamp());
		return result;
	}

	public String getFullName() {
		StringBuilder sB = new StringBuilder();
		if (lastName != null) {
			sB.append(lastName);
			if (firstName != null || patronymic != null) {
				sB.append(" ");
			}
		}
		if (firstName != null) {
			sB.append(firstName);
			if (patronymic != null) {
				sB.append(" ");
			}
		}
		if (patronymic != null) {
			sB.append(patronymic);
		}
		return sB.toString();
	}

	public String getFullNameWithLogin() {
		String fullName = getFullName();
		if (login != null) {
			fullName = format("(%s) %s", login, fullName);
		}
		return fullName;
	}

}
