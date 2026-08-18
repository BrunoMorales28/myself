import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";

// Plain constants, not the MUI theme — @react-pdf/renderer renders outside
// the DOM/MUI's styling engine, so the relevant palette values are
// re-declared here rather than imported.
const colors = {
  heading: "#0B3D66",
  text: "#1A1F24",
  muted: "#5A6472",
  divider: "#D8DEE4",
};

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    color: colors.text,
    fontFamily: "Helvetica",
  },
  name: {
    fontSize: 20,
    color: colors.heading,
    fontFamily: "Helvetica-Bold",
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  contactLink: {
    fontSize: 9,
    color: colors.heading,
    textDecoration: "none",
  },
  sectionHeading: {
    fontSize: 12,
    color: colors.heading,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottom: `1pt solid ${colors.divider}`,
  },
  entry: {
    marginBottom: 10,
  },
  entryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
  },
  entryDateRange: {
    fontSize: 9,
    color: colors.muted,
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: colors.muted,
    marginBottom: 2,
  },
  description: {
    fontSize: 9.5,
    marginBottom: 2,
  },
  bulletList: {
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bulletMarker: {
    fontSize: 9.5,
    marginRight: 4,
  },
  bulletText: {
    fontSize: 9.5,
    flex: 1,
  },
  skillCategory: {
    fontSize: 9.5,
    marginBottom: 3,
  },
  skillCategoryLabel: {
    fontFamily: "Helvetica-Bold",
  },
});

export type CvExperienceEntry = {
  company: string;
  role: string;
  dateRange: string;
  description: string;
  bullets: string[];
};

export type CvStudyEntry = {
  institution: string;
  degree: string;
  dateRange: string;
  description: string;
};

export type CvSkillCategory = {
  label: string;
  items: string[];
};

export type CvDocumentProps = {
  headerLine: string;
  contact: {
    email: string;
    linkedinUrl: string;
    githubUrl: string;
  };
  experienceHeading: string;
  experienceEntries: CvExperienceEntry[];
  studiesHeading: string;
  studiesEntries: CvStudyEntry[];
  skillsHeading: string;
  skillCategories: CvSkillCategory[];
};

export function CvDocument({
  headerLine,
  contact,
  experienceHeading,
  experienceEntries,
  studiesHeading,
  studiesEntries,
  skillsHeading,
  skillCategories,
}: CvDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{headerLine}</Text>
        <View style={styles.contactRow}>
          <Link style={styles.contactLink} src={`mailto:${contact.email}`}>
            {contact.email}
          </Link>
          <Link style={styles.contactLink} src={contact.linkedinUrl}>
            LinkedIn
          </Link>
          <Link style={styles.contactLink} src={contact.githubUrl}>
            GitHub
          </Link>
        </View>

        <Text style={styles.sectionHeading}>{experienceHeading}</Text>
        {experienceEntries.map((entry, i) => (
          <View key={i} style={styles.entry}>
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>{entry.company}</Text>
              <Text style={styles.entryDateRange}>{entry.dateRange}</Text>
            </View>
            <Text style={styles.entrySubtitle}>{entry.role}</Text>
            <Text style={styles.description}>{entry.description}</Text>
            {entry.bullets.length > 0 && (
              <View style={styles.bulletList}>
                {entry.bullets.map((bullet, j) => (
                  <View key={j} style={styles.bulletRow}>
                    <Text style={styles.bulletMarker}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <Text style={styles.sectionHeading}>{studiesHeading}</Text>
        {studiesEntries.map((entry, i) => (
          <View key={i} style={styles.entry}>
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>{entry.institution}</Text>
              <Text style={styles.entryDateRange}>{entry.dateRange}</Text>
            </View>
            <Text style={styles.entrySubtitle}>{entry.degree}</Text>
            <Text style={styles.description}>{entry.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>{skillsHeading}</Text>
        {skillCategories.map((category, i) => (
          <Text key={i} style={styles.skillCategory}>
            <Text style={styles.skillCategoryLabel}>{category.label}: </Text>
            {category.items.join(", ")}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
